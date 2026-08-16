"use client"

import {
    Home,
    KeyIcon,
    DraftingCompassIcon,
    Search,
    ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCities } from "@/hooks/useCities"
import { usePropertyTypes } from "@/hooks/usePropertyMutations"
import { useLocations } from "@/hooks/useLocations"
import { engineeringServices } from "@/data/engineeringServices"
import { cn } from "@/lib/utils"

interface ThreeboxProps {
    SetBoxNuber: (n: 1 | 2 | 3) => void
}

const TABS = [
    {
        id: 1 as const,
        title: "خرید ملک",
        subtitle: "پیدا کردن بهترین گزینه‌های خرید ملک",
        icon: Home,
        transaction: "buy" as const,
    },
    {
        id: 2 as const,
        title: "اجاره ملک",
        subtitle: "املاک آماده اجاره با فیلترهای دقیق ",
        icon: KeyIcon,
        transaction: "rent" as const,
    },
    {
        id: 3 as const,
        title: "خدمات مهندسی",
        subtitle: "از نقشه تا تاییدیه؛ خدمات مهندسی کامل",
        icon: DraftingCompassIcon,
        transaction: null,
    },
]

const Threebox = ({ SetBoxNuber }: ThreeboxProps) => {
    const router = useRouter()
    const [box, setBox] = useState<1 | 2 | 3>(1)
    const [tab, setTab] = useState<"buy" | "rent">("buy")
    const [city, setCity] = useState<string | undefined>(undefined)
    const [location, setLocation] = useState<string | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [price, setPrice] = useState<string | undefined>(undefined)
    const [selectedService, setSelectedService] = useState<string>(
        engineeringServices[0].name
    )

    const { data: cities = [], isLoading: citiesLoading } = useCities()
    const { data: propertyTypes = [], isLoading: propertyTypesLoading } =
        usePropertyTypes()
    const selectedCityId = city ? Number(city) : undefined
    const { data: locations = [], isLoading: locationsLoading } = useLocations(
        selectedCityId,
        { enabled: !!selectedCityId }
    )

    const currentService =
        engineeringServices.find((s) => s.name === selectedService) ||
        engineeringServices[0]

    const selectTab = (id: 1 | 2 | 3, transaction: "buy" | "rent" | null) => {
        setBox(id)
        SetBoxNuber(id)
        if (transaction) setTab(transaction)
    }

    const submitSearch = useCallback(() => {
        const searchParams = new URLSearchParams()
        searchParams.set("transaction_type", tab === "buy" ? "sale" : "rent")
        searchParams.set("from", "home")
        if (city) searchParams.set("city", city)
        if (location) searchParams.set("location", location)
        if (type) searchParams.set("property_type", type)
        if (price) {
            const priceRanges: Record<string, { min: string; max: string }> = {
                low: { min: "0", max: "5000000000" },
                mid: { min: "5000000000", max: "20000000000" },
                high: { min: "20000000000", max: "100000000000" },
            }
            if (priceRanges[price]) {
                searchParams.set("min_price", priceRanges[price].min)
                searchParams.set("max_price", priceRanges[price].max)
            }
        }
        router.push(`/properties?${searchParams.toString()}`)
    }, [router, tab, city, location, type, price])

    return (
        <div className="hidden lg:flex lg:justify-center" dir="rtl">
            <div className="relative w-8/12 min-w-[960px] max-w-[1050px]">
                {/* ── تب‌ها ── */}
                <div className="relative z-10 flex items-end justify-between gap-3">
                    {TABS.map((t) => {
                        const Icon = t.icon
                        const isActive = box === t.id
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => selectTab(t.id, t.transaction)}
                                className={cn(
                                    "relative flex-1 text-right transition-all duration-200",
                                    isActive
                                        ? "z-20 rounded-t-[16px] bg-white px-5 pb-8 pt-4"
                                        : "z-10 mb-4 cursor-pointer rounded-[16px] bg-white px-5 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                                )}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-[26px] font-bold leading-tight text-black">
                                            {t.title}
                                        </span>
                                        <span className="text-[13px] leading-snug text-neutral-500 line-clamp-1">
                                            {t.subtitle}
                                        </span>
                                    </div>
                                    <Icon
                                        className="h-10 w-10 shrink-0 text-black"
                                        strokeWidth={1.25}
                                    />
                                </div>

                                {/* پل اتصال تب فعال به پنل پایین */}
                                {isActive && (
                                    <div className="absolute -bottom-1 left-0 right-0 h-4 bg-white" />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* ── پنل محتوا ── */}
                <div
                    className={cn(
                        "relative z-0 -mt-1 rounded-b-[16px] bg-white px-6 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.13)]",
                        box === 1 && "rounded-tl-[16px] rounded-tr-none",
                        box === 2 && "rounded-t-[16px]",
                        box === 3 && "rounded-tr-[16px] rounded-tl-none max-h-[280px]",
                        box <= 2 ? "min-h-[148px]" : ""
                    )}
                >
                    {box <= 2 ? (
                        /* ── فیلترها و جستجو ── */
                        <div
                            className="flex flex-col justify-evenly gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="pr-1 text-xl font-bold text-black">
                                فیلترها و جستجو
                            </h3>
                            <div className="flex items-center justify-between gap-3">
                                <SearchableSelect
                                    value={city}
                                    onValueChange={(value) => {
                                        setCity(value)
                                        setLocation(undefined)
                                    }}
                                    options={cities.map((c) => ({
                                        value: c.id.toString(),
                                        label: c.name,
                                    }))}
                                    placeholder="شهر"
                                    searchPlaceholder="جستجوی شهر..."
                                    loading={citiesLoading}
                                    triggerClassName="h-10 w-[210px] rounded-lg border-2 border-black bg-white shadow-none focus:ring-0 focus:ring-offset-0"
                                />

                                <SearchableSelect
                                    value={location}
                                    onValueChange={setLocation}
                                    disabled={!selectedCityId}
                                    options={locations.map((loc) => ({
                                        value: loc.id.toString(),
                                        label: loc.name,
                                    }))}
                                    placeholder={selectedCityId ? "منطقه" : "ابتدا شهر را انتخاب کنید"}
                                    searchPlaceholder="جستجوی منطقه..."
                                    emptyText="منطقه‌ای یافت نشد"
                                    loading={locationsLoading}
                                    triggerClassName="h-10 w-[210px] rounded-lg border-2 border-black bg-white shadow-none focus:ring-0 focus:ring-offset-0"
                                />

                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger
                                        dir="rtl"
                                        className="h-10 w-[210px] rounded-lg border-2 border-black bg-white shadow-none"
                                    >
                                        <SelectValue placeholder="نوع ملک" />
                                    </SelectTrigger>
                                    <SelectContent
                                        side="bottom"
                                        collisionPadding={{ top: 80, bottom: 16, left: 8, right: 8 }}
                                    >
                                        {propertyTypesLoading ? (
                                            <SelectItem value="loading" disabled>
                                                در حال بارگذاری...
                                            </SelectItem>
                                        ) : (
                                            propertyTypes.map((pt) => (
                                                <SelectItem
                                                    key={pt.id}
                                                    value={pt.id.toString()}
                                                >
                                                    {pt.title}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>

                                <Button
                                    className="h-10 flex-1 rounded-lg bg-[#1055CB] text-white hover:bg-[#1055CB]/90"
                                    onClick={submitSearch}
                                >
                                    <Search className="h-4 w-4" />
                                    جستجو ملک مورد نظر
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* ── خدمات مهندسی ── */
                        <div
                            className="flex flex-col justify-around gap-3 "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="pr-1 text-xl font-bold text-black">
                                خدمات ما
                            </h3>

                            <div className="flex flex-wrap gap-2 px-1">
                                {engineeringServices.map((service) => {
                                    const Icon = service.icon
                                    const isSelected =
                                        selectedService === service.name
                                    return (
                                        <button
                                            key={service.name}
                                            type="button"
                                            onClick={() =>
                                                setSelectedService(service.name)
                                            }
                                            className={cn(
                                                "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all",
                                                isSelected
                                                    ? "border-transparent bg-[#1055CB] text-white shadow-md hover:bg-[#1055CB]/90"
                                                    : "border-[#1055CB] bg-white text-[#1055CB] hover:bg-neutral-50"
                                            )}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span>{service.name}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* توضیحات راست + دکمه چپ — مثل Figma */}
                            <div className="flex items-end gap-4 px-1">
                                <p className="line-clamp-2 flex-1 text-right text-sm leading-7 text-neutral-600">
                                    {currentService.details}
                                </p>
                                <button
                                    type="button"
                                    className="shrink-0 rounded-lg bg-[#1055CB] px-5 py-3 text-sm font-medium text-white hover:bg-[#1055CB]/90"
                                    onClick={() => router.push("/engineering")}
                                >
                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                        مشاهده اطلاعات بیشتر
                                        <ChevronLeft className="h-4 w-4" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Threebox
