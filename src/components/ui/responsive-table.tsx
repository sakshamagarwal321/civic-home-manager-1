
import { ReactNode, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Grid, List } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponsiveTableProps {
  headers: string[]
  data: any[]
  renderRow: (item: any, index: number) => ReactNode
  renderCard: (item: any, index: number) => ReactNode
  className?: string
}

export const ResponsiveTable = ({
  headers,
  data,
  renderRow,
  renderCard,
  className
}: ResponsiveTableProps) => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-end">
        <div className="flex rounded-md border">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="rounded-r-none"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("card")}
            className="rounded-l-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => renderRow(item, index))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item, index) => renderCard(item, index))}
        </div>
      )}

      {/* Mobile card view (always shown on mobile) */}
      <div className="md:hidden">
        <div className="space-y-4">
          {data.map((item, index) => renderCard(item, index))}
        </div>
      </div>
    </div>
  )
}
