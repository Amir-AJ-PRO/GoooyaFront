import { NextRequest, NextResponse } from 'next/server';
import { 
  indexProperty, 
  updatePropertyInIndex, 
  deletePropertyFromIndex 
} from '@/lib/searchIndexManager';

/**
 * Webhook برای sync خودکار املاک با Elasticsearch
 * POST /api/webhooks/property-sync
 * 
 * این endpoint توسط Django backend فراخوانی می‌شود تا تغییرات املاک
 * را به صورت خودکار در Elasticsearch اعمال کند.
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: بررسی امنیت webhook (signature verification)
    // const signature = request.headers.get('X-Webhook-Signature');
    // if (!verifyWebhookSignature(signature, body)) {
    //   return NextResponse.json({ error: 'امضای نامعتبر' }, { status: 401 });
    // }

    const body = await request.json();
    const { action, property } = body;

    if (!action || !property) {
      return NextResponse.json(
        { error: 'پارامترهای action و property الزامی هستند' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'created':
        // ملک جدید ایجاد شده
        result = await indexProperty(property);
        break;

      case 'updated':
        // ملک بروزرسانی شده
        result = await updatePropertyInIndex(property);
        break;

      case 'deleted':
        // ملک حذف شده
        result = await deletePropertyFromIndex(property.id);
        break;

      case 'status_changed':
        // وضعیت ملک تغییر کرده
        if (property.show_status === 'ok') {
          result = await indexProperty(property);
        } else {
          result = await deletePropertyFromIndex(property.id);
        }
        break;

      default:
        return NextResponse.json(
          { error: 'عمل نامعتبر. اعمال مجاز: created, updated, deleted, status_changed' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
      action,
      property_id: property.id
    });

  } catch (error) {
    console.error('خطا در webhook property sync:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در پردازش webhook',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}

/**
 * تست webhook
 * GET /api/webhooks/property-sync
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Property sync webhook is active',
    timestamp: new Date().toISOString()
  });
}
