import { Skeleton } from "../../ui/patientProfile/skeleton"
import { Card, CardContent, CardHeader } from "../../ui/patientProfile/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/patientProfile/tabs"
import { AceternityNav } from "../../components/AceternaityNav"

export function DoctorProfileShimmer() {
  return (
    <>
    <AceternityNav/>
    <div className="container mx-auto pt-28 pb-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Left column - Doctor info */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-40 mb-1" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="space-y-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}

                {/* Education section with multiple entries */}
                <div className="flex flex-col space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-2">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="text-sm">
                          <Skeleton className="h-4 w-48 mb-1" />
                          <Skeleton className="h-4 w-64" />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-[180px]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="h-2 bg-muted" />
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div>
                                <Skeleton className="h-5 w-40 mb-1" />
                                <Skeleton className="h-4 w-32" />
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Skeleton className="h-6 w-24 rounded-full" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-4 w-4 ml-2" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </>
  )
}

