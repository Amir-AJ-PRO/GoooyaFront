# معماری DDD پیشنهادی برای گویا

## ساختار کلی

```
src/
├── domains/                          # Domain Layer (قلب business logic)
│   │
│   ├── property/                     # Property Domain
│   │   ├── entities/
│   │   │   ├── Property.ts          # Entity اصلی
│   │   │   └── PropertyImage.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── PropertyId.ts
│   │   │   ├── Price.ts
│   │   │   ├── Area.ts
│   │   │   └── Address.ts
│   │   │
│   │   ├── aggregates/
│   │   │   └── PropertyListing.ts   # Aggregate Root
│   │   │
│   │   ├── repositories/
│   │   │   └── IPropertyRepository.ts
│   │   │
│   │   ├── services/
│   │   │   └── PropertyDomainService.ts
│   │   │
│   │   └── events/
│   │       ├── PropertyCreated.ts
│   │       └── PropertySold.ts
│   │
│   └── user/                         # User Domain
│       ├── entities/
│       │   ├── User.ts
│       │   ├── Agent.ts
│       │   └── Admin.ts
│       │
│       ├── value-objects/
│       │   ├── UserId.ts
│       │   ├── Phone.ts
│       │   └── Email.ts
│       │
│       └── repositories/
│           └── IUserRepository.ts
│
├── application/                      # Application Layer
│   │
│   ├── property/
│   │   ├── use-cases/
│   │   │   ├── create-property/
│   │   │   │   ├── CreatePropertyUseCase.ts
│   │   │   │   ├── CreatePropertyInput.ts
│   │   │   │   └── CreatePropertyOutput.ts
│   │   │   │
│   │   │   ├── update-property/
│   │   │   └── delete-property/
│   │   │
│   │   ├── queries/
│   │   │   ├── GetPropertyById.ts
│   │   │   └── SearchProperties.ts
│   │   │
│   │   └── services/
│   │       └── PropertyApplicationService.ts
│   │
│   └── user/
│       ├── use-cases/
│       └── queries/
│
├── infrastructure/                   # Infrastructure Layer
│   │
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   │
│   │   ├── repositories/
│   │   │   ├── PrismaPropertyRepository.ts
│   │   │   └── PrismaUserRepository.ts
│   │   │
│   │   └── mappers/
│   │       ├── PropertyMapper.ts
│   │       └── UserMapper.ts
│   │
│   ├── external-apis/
│   │   ├── MinioStorageService.ts
│   │   └── SMSService.ts
│   │
│   └── messaging/
│       └── EventBus.ts
│
├── presentation/                     # Presentation Layer
│   │
│   ├── app/                         # Next.js App Router
│   │   ├── (site)/
│   │   ├── (dashboard)/
│   │   └── api/
│   │
│   └── components/
│       ├── layout/
│       ├── forms/
│       └── cards/
│
└── shared/                          # Shared Kernel
    ├── kernel/
    │   ├── Entity.ts
    │   ├── ValueObject.ts
    │   ├── AggregateRoot.ts
    │   └── DomainEvent.ts
    │
    └── utils/
        └── Result.ts
```

## مثال‌های کد

### 1. Domain Entity
```typescript
// domains/property/entities/Property.ts
import { Entity } from '@/shared/kernel/Entity';
import { PropertyId } from '../value-objects/PropertyId';
import { Price } from '../value-objects/Price';

export enum PropertyStatus {
  Draft = 'draft',
  Active = 'active',
  Sold = 'sold',
  Rejected = 'rejected'
}

interface PropertyProps {
  title: string;
  price: Price;
  area: number;
  status: PropertyStatus;
  agentId: string;
}

export class Property extends Entity<PropertyId, PropertyProps> {
  private constructor(id: PropertyId, props: PropertyProps) {
    super(id, props);
  }

  // Factory method
  public static create(props: PropertyProps): Property {
    const id = PropertyId.generate();
    return new Property(id, {
      ...props,
      status: PropertyStatus.Draft
    });
  }

  // Business logic
  public publish(): void {
    if (this.props.status === PropertyStatus.Sold) {
      throw new Error('Cannot publish sold property');
    }
    if (!this.isValid()) {
      throw new Error('Property is not valid for publishing');
    }
    this.props.status = PropertyStatus.Active;
  }

  public markAsSold(): void {
    if (this.props.status !== PropertyStatus.Active) {
      throw new Error('Only active properties can be marked as sold');
    }
    this.props.status = PropertyStatus.Sold;
  }

  public changePrice(newPrice: Price): void {
    if (this.props.status === PropertyStatus.Sold) {
      throw new Error('Cannot change price of sold property');
    }
    this.props.price = newPrice;
  }

  private isValid(): boolean {
    return this.props.title.length > 5 
      && this.props.price.isPositive()
      && this.props.area > 0;
  }

  // Getters
  public get title(): string {
    return this.props.title;
  }

  public get price(): Price {
    return this.props.price;
  }

  public get status(): PropertyStatus {
    return this.props.status;
  }
}
```

### 2. Value Object
```typescript
// domains/property/value-objects/Price.ts
import { ValueObject } from '@/shared/kernel/ValueObject';

interface PriceProps {
  amount: number;
  currency: string;
}

export class Price extends ValueObject<PriceProps> {
  private constructor(props: PriceProps) {
    super(props);
    this.validate();
  }

  public static create(amount: number, currency: string = 'IRR'): Price {
    return new Price({ amount, currency });
  }

  private validate(): void {
    if (this.props.amount < 0) {
      throw new Error('Price cannot be negative');
    }
    if (!['IRR', 'USD'].includes(this.props.currency)) {
      throw new Error('Invalid currency');
    }
  }

  public isPositive(): boolean {
    return this.props.amount > 0;
  }

  public add(other: Price): Price {
    if (this.props.currency !== other.props.currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return Price.create(
      this.props.amount + other.props.amount,
      this.props.currency
    );
  }

  public format(): string {
    return `${this.props.amount.toLocaleString('fa-IR')} ${this.props.currency}`;
  }
}
```

### 3. Use Case
```typescript
// application/property/use-cases/create-property/CreatePropertyUseCase.ts
import { IPropertyRepository } from '@/domains/property/repositories/IPropertyRepository';
import { IUserRepository } from '@/domains/user/repositories/IUserRepository';
import { Property } from '@/domains/property/entities/Property';
import { Price } from '@/domains/property/value-objects/Price';

export interface CreatePropertyInput {
  title: string;
  price: number;
  area: number;
  agentId: string;
}

export interface CreatePropertyOutput {
  propertyId: string;
}

export class CreatePropertyUseCase {
  constructor(
    private propertyRepository: IPropertyRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(input: CreatePropertyInput): Promise<CreatePropertyOutput> {
    // 1. Validate agent exists and has permission
    const agent = await this.userRepository.findById(input.agentId);
    if (!agent || !agent.isAgent()) {
      throw new Error('User is not authorized to create properties');
    }

    // 2. Create domain entity with business logic
    const property = Property.create({
      title: input.title,
      price: Price.create(input.price),
      area: input.area,
      status: PropertyStatus.Draft,
      agentId: input.agentId
    });

    // 3. Save to repository
    await this.propertyRepository.save(property);

    // 4. Return output
    return {
      propertyId: property.id.value
    };
  }
}
```

### 4. Repository Implementation
```typescript
// infrastructure/database/repositories/PrismaPropertyRepository.ts
import { IPropertyRepository } from '@/domains/property/repositories/IPropertyRepository';
import { Property } from '@/domains/property/entities/Property';
import { PropertyId } from '@/domains/property/value-objects/PropertyId';
import { PropertyMapper } from '../mappers/PropertyMapper';
import { prisma } from '../prisma/client';

export class PrismaPropertyRepository implements IPropertyRepository {
  async findById(id: PropertyId): Promise<Property | null> {
    const data = await prisma.property.findUnique({
      where: { id: id.value }
    });
    
    if (!data) return null;
    
    return PropertyMapper.toDomain(data);
  }

  async save(property: Property): Promise<void> {
    const data = PropertyMapper.toPersistence(property);
    
    await prisma.property.upsert({
      where: { id: property.id.value },
      create: data,
      update: data
    });
  }

  async delete(id: PropertyId): Promise<void> {
    await prisma.property.delete({
      where: { id: id.value }
    });
  }

  async findAll(filters?: PropertyFilters): Promise<Property[]> {
    const data = await prisma.property.findMany({
      where: this.buildWhereClause(filters)
    });
    
    return data.map(PropertyMapper.toDomain);
  }

  private buildWhereClause(filters?: PropertyFilters) {
    // Build Prisma where clause from domain filters
    return {};
  }
}
```

## مزایای این معماری

1. **Business Logic محافظت شده** - در Domain Layer
2. **Database Independent** - تغییر DB آسان است
3. **Testability بالا** - هر layer جداگانه تست میشه
4. **Maintainability** - تغییرات محلی هستند
5. **Team Scalability** - تیم‌ها روی domain‌های مختلف کار می‌کنن

## معایب

1. **پیچیدگی بالا** - برای تیم کوچک سنگینه
2. **Boilerplate زیاد** - کد بیشتر برای همون کار
3. **Learning Curve** - نیاز به آموزش تیم
4. **Over-engineering** برای MVP

## توصیه

برای گویا در مرحله فعلی، استراکچر موجود کافیه. 
DDD رو وقتی پیاده کن که:
- تیم 5+ نفره شدید
- Business logic پیچیده شد
- نیاز به Multiple Bounded Contexts پیدا کردید

