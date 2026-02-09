import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecentSale } from '@/types/dashboard.type'
import { Badge } from '@/components/ui/badge' // Import Badge

export const RecentSales = ({ sales }: { sales: RecentSale[] }) => {
  return (
    <Card className="col-span-3 bg-slate-950 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-100">Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${sale.customerName}&background=0D8ABC&color=fff`}
                  alt="Avatar"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none text-slate-100">
                  {sale.customerName}
                </p>
                {/* 👇 UPDATE: Show Event Name + Tier Badge */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="line-clamp-1 max-w-30">
                    {sale.eventName}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-4 px-1 bg-slate-800 text-blue-400"
                  >
                    {sale.tierName || 'Standard'}
                  </Badge>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-medium text-emerald-500">
                  +${sale.amount.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500">
                  {sale.tickets} tix
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
