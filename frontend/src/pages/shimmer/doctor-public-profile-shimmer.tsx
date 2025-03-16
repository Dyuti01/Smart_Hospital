import { Skeleton } from "../../ui/patientProfile/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "../../ui/patientProfile/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/patientProfile/tabs"
import { AceternityNav } from "../../components/AceternaityNav"

export function DoctorPublicProfileShimmer() {
  return (
    <>
    <AceternityNav/>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero section with doctor info */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
        <div className="container mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Skeleton className="rounded-full border-4 border-white shadow-xl overflow-hidden h-48 w-48 md:h-64 md:w-64" />
              <Skeleton className="absolute bottom-3 right-3 h-8 w-24 rounded-full" />
            </div>

            <div className="text-center md:text-left">
              <Skeleton className="h-10 w-64 mb-2 bg-white/20" />
              <Skeleton className="h-6 w-40 mb-4 bg-white/20" />

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                <Skeleton className="h-6 w-32 rounded-full bg-white/20" />
                <Skeleton className="h-6 w-40 rounded-full bg-white/20" />
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                <Skeleton className="h-10 w-28 rounded-md bg-white/20" />
                <Skeleton className="h-10 w-28 rounded-md bg-white/20" />
                <Skeleton className="h-10 w-28 rounded-md bg-white/20" />
              </div>
            </div>

            <div className="mt-8 md:mt-0 md:ml-auto">
              <Card className="bg-white text-cyan-900 shadow-lg border-0">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-40 mx-auto" />
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <Skeleton className="h-8 w-24 mx-auto mb-1" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full rounded-md" />
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Doctor info */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <TabsTrigger key={i} value={`tab-${i}`} className="text-sm sm:text-base">
                      <Skeleton className="h-5 w-16" />
                    </TabsTrigger>
                  ))}
              </TabsList>

              <TabsContent value="about">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Skeleton className="h-24 w-full" />

                    <div>
                      <Skeleton className="h-6 w-40 mb-3" />
                      <div className="flex flex-wrap gap-2">
                        {Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-8 w-32 rounded-full" />
                          ))}
                      </div>
                    </div>

                    <div>
                      <Skeleton className="h-6 w-32 mb-3" />
                      <div className="flex flex-wrap gap-2">
                        {Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-8 w-24 rounded-full" />
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Booking */}
          <div>
            <Card className="border-0 shadow-sm sticky top-4">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-5 w-32 mb-3" />
                  <div className="border rounded-lg p-3">
                    <Skeleton className="h-64 w-full rounded-md" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-5 w-40 mb-3" />
                  <div className="grid grid-cols-3 gap-2">
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-10 rounded-md" />
                      ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full rounded-md" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

