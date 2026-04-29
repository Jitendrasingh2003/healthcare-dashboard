// Reusable Skeleton components for loading states

export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`glass-card p-5 animate-pulse ${className}`}>
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
            <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
            <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded-full" />
        </div>
    );
}

export function SkeletonListCard({ className = "" }: { className?: string }) {
    return (
        <div className={`glass-card p-5 animate-pulse ${className}`}>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
                    <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded-full mb-2" />
                    <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
                </div>
                <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
        </div>
    );
}

export function SkeletonTableRow() {
    return (
        <tr className="border-b border-gray-100/50 dark:border-gray-800/50 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
                <td key={i} className="py-4 px-4">
                    <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800" style={{ width: `${40 + i * 10}%` }} />
                </td>
            ))}
        </tr>
    );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 animate-pulse ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-3 rounded-full bg-gray-100 dark:bg-gray-800" style={{ width: `${100 - i * 15}%` }} />
            ))}
        </div>
    );
}
