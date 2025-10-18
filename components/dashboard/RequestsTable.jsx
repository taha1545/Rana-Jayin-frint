'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Bell, Phone, MapPin } from 'lucide-react';

export default function RequestsTable({ mockRequests, t, page, setPage, handleShowMap }) {
    const itemsPerPage = 5;
    const totalPages = Math.ceil(mockRequests.length / itemsPerPage);

    const currentRequests = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return mockRequests.slice(start, start + itemsPerPage);
    }, [mockRequests, page]);

    return (
        <section className="space-y-4">
            {/* Header */}
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                {t('dashboard.requests', { defaultValue: 'Recent Requests' })}
            </h2>

            {/* Table Card */}
            <Card className="border border-muted rounded-2xl shadow-sm">
                <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                        <Table className="min-w-full text-sm">
                            <TableCaption className="text-muted-foreground text-xs mt-4">
                                {t('dashboard.latestRequests', { defaultValue: 'Latest service requests' })}
                            </TableCaption>

                            <TableHeader>
                                <TableRow className="bg-muted/30 text-sm ">
                                    <TableHead className="w-[30%] font-semibold">{t('dashboard.client')}</TableHead>
                                    <TableHead className="w-[25%] font-semibold">{t('dashboard.phone')}</TableHead>
                                    <TableHead className="w-[20%] font-semibold">{t('dashboard.status', { defaultValue: 'Status' })}</TableHead>
                                    <TableHead className="w-[25%] font-semibold text-center">{t('dashboard.action')}</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentRequests.length > 0 ? (
                                    currentRequests.map((req) => (
                                        <TableRow
                                            key={req.id}
                                            className="hover:bg-muted/20 transition-colors text-sm"
                                        >
                                            {/* Client */}
                                            <TableCell className="truncate font-medium">
                                                {req.client}
                                            </TableCell>

                                            {/* Phone */}
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <span className="truncate">{req.phone}</span>
                                                </div>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        req.status === 'Completed'
                                                            ? 'success'
                                                            : req.status === 'Pending'
                                                                ? 'secondary'
                                                                : 'default'
                                                    }
                                                    className="px-2 py-1 text-xs rounded-md"
                                                >
                                                    {req.status}
                                                </Badge>
                                            </TableCell>

                                            {/* Action */}
                                            <TableCell className="text-center flex justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleShowMap(req)}
                                                    className="flex items-center justify-center gap-1"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    {t('dashboard.viewMap', { defaultValue: 'View on Map' })}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center py-6 text-muted-foreground"
                                        >
                                            {t('dashboard.noRequests', { defaultValue: 'No requests found.' })}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-muted-foreground">
                            {t('pagination.pageOf', { page, total: totalPages })}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                {t('pagination.prev', { defaultValue: 'Previous' })}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                {t('pagination.next', { defaultValue: 'Next' })}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
