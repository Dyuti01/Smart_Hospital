import { Skeleton } from "../../ui/patientProfile/skeleton"
import { Card, CardContent } from "../../ui/patientProfile/card"
import { AceternityNav } from "../../components/AceternaityNav"
import { AuroraBackground } from "../../ui/AuroraBackground"

export default function DoctorsListLoading() {
  return (
    <>
    <AuroraBackground>
    <AceternityNav/>
    <div className="container mx-auto pt-[140px] pb-8 px-4 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <Skeleton className="h-10 w-full" />

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Skeleton className="h-6 w-20" />

            <div className="flex flex-wrap gap-3 flex-1">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <Skeleton className="h-5 w-40" />
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
    </AuroraBackground>
    </>
  )
}

