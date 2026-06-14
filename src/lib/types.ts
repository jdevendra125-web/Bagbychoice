export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price: number | null
  discount_percent: number
  category: string
  images: string[]
  is_listed: boolean
  stock_quantity: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  product_image: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  customer_address: string
  customer_city: string
  customer_pincode: string
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export const CATEGORIES = [
  { value: 'handbag', label: 'Handbag' },
  { value: 'purse', label: 'Purse' },
  { value: 'clutch', label: 'Clutch' },
  { value: 'tote', label: 'Tote Bag' },
  { value: 'sling', label: 'Sling Bag' },
  { value: 'backpack', label: 'Backpack' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'other', label: 'Other' },
]

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
]
