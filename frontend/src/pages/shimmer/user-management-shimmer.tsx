import { AceternityNav } from "../../components/AceternaityNav"
import { AuroraBackground } from "../../ui/AuroraBackground"
import { Skeleton } from "../../ui/patientProfile/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/patientProfile/table"

const UserManagementShimmer = () => {
    return (
        <AuroraBackground>
            <AceternityNav />
            <div className="space-y-6 px-[30px] pt-[150px] z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-40" />
                </div>

                {/* Search and filter */}
                <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-10 w-full max-w-sm" />
                    <Skeleton className="h-10 w-[180px]" />
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Skeleton className="h-5 w-20" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-5 w-16" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-5 w-24" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-5 w-16" />
                                </TableHead>
                                <TableHead className="text-right">
                                    <Skeleton className="h-5 w-16 ml-auto" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-40" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-16" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuroraBackground>
            )
}

            export default UserManagementShimmer

