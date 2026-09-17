import { orderRepository } from '@/lib/data/order-repository'
import { validateCustomerDetails } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer, items } = body

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { message: 'بيانات الطلب غير مكتملة' },
        { status: 400 }
      )
    }

    const validation = validateCustomerDetails(customer)
    if (!validation.isValid) {
      return Response.json(
        { message: 'بيانات الزبون غير صحيحة', errors: validation.errors },
        { status: 400 }
      )
    }

    // Save order via OrderRepository (recalculates totals safely server-side)
    const order = await orderRepository.createOrder({
      customer,
      items,
    })

    return Response.json({ success: true, order }, { status: 201 })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    return Response.json({ message }, { status: 400 })
  }
}
