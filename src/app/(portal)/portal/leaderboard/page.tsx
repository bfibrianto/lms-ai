import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Trophy, Medal, User as UserIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
    const session = await auth()
    if (!session?.user?.id) {
        redirect('/auth/login')
    }
    const currentUserId = session.user.id

    const topUsers = await db.user.findMany({
        where: { isActive: true },
        orderBy: { points: 'desc' },
        take: 50,
        select: {
            id: true,
            name: true,
            points: true,
            avatar: true,
            department: true,
        },
    })

    // Find current user's rank
    const currentUserRank = topUsers.findIndex((u) => u.id === currentUserId) + 1
    const currentUserData = topUsers.find((u) => u.id === currentUserId)

    // Top 3 gets special styling
    const top3 = topUsers.slice(0, 3)
    const restUsers = topUsers.slice(3)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Leaderboard Global</h1>
                <p className="text-muted-foreground mt-2">
                    Peringkat peserta didik teratas berdasarkan perolehan poin. Selesaikan kursus dan kuis untuk meraih posisi pertama!
                </p>
            </div>

            {currentUserData && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="flex items-center gap-6 p-6">
                        <div className="flex bg-primary/10 h-16 w-16 items-center justify-center rounded-full text-primary font-black text-2xl">
                            #{currentUserRank}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Peringkat Anda Saat Ini</p>
                            <h3 className="text-2xl font-bold">{currentUserData.points} PTS</h3>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top 3 Podium */}
            <div className="grid gap-6 md:grid-cols-3 items-end pt-8 pb-4">
                {/* Rank 2 */}
                {top3[1] && (
                    <Card className="relative overflow-hidden border-slate-200 shadow-md bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 order-2 md:order-1 transform transition hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Medal className="h-24 w-24" />
                        </div>
                        <CardContent className="flex flex-col items-center p-6 text-center z-10 relative">
                            <div className="relative mb-4">
                                <Avatar className="h-20 w-20 border-4 border-slate-300">
                                    <AvatarImage src={top3[1].avatar || undefined} />
                                    <AvatarFallback><UserIcon className="h-10 w-10 text-slate-400" /></AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-300 text-slate-700 px-3 py-0.5 text-xs font-black shadow-sm">
                                    #2
                                </div>
                            </div>
                            <h3 className="font-bold text-lg line-clamp-1">{top3[1].name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{top3[1].department || 'Learner'}</p>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5 font-bold text-slate-700 dark:text-slate-300 shadow-inner">
                                {top3[1].points} PTS
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Rank 1 */}
                {top3[0] && (
                    <Card className="relative overflow-hidden border-amber-200 shadow-lg bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 order-1 md:order-2 transform transition hover:-translate-y-2 lg:-translate-y-4">
                        <div className="absolute -top-4 -right-4 p-4 opacity-10 text-amber-500">
                            <Trophy className="h-32 w-32" />
                        </div>
                        <CardContent className="flex flex-col items-center p-8 text-center z-10 relative">
                            <div className="relative mb-4">
                                <Avatar className="h-24 w-24 border-4 border-amber-400 shadow-md shadow-amber-400/20">
                                    <AvatarImage src={top3[0].avatar || undefined} />
                                    <AvatarFallback><UserIcon className="h-12 w-12 text-amber-400" /></AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-0.5 text-sm font-black shadow-sm">
                                    #1
                                </div>
                            </div>
                            <h3 className="font-bold text-xl line-clamp-1 text-amber-900 dark:text-amber-100">{top3[0].name}</h3>
                            <p className="text-sm text-amber-700/70 dark:text-amber-300/70 mb-4">{top3[0].department || 'Learner'}</p>
                            <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full px-5 py-2 font-black text-amber-700 dark:text-amber-400 shadow-inner text-lg">
                                {top3[0].points} PTS
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Rank 3 */}
                {top3[2] && (
                    <Card className="relative overflow-hidden border-orange-200 shadow-sm bg-gradient-to-b from-white to-orange-50 dark:from-slate-900 dark:to-orange-950/20 order-3 transform transition hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Medal className="h-24 w-24" />
                        </div>
                        <CardContent className="flex flex-col items-center p-6 text-center z-10 relative">
                            <div className="relative mb-4">
                                <Avatar className="h-16 w-16 border-4 border-orange-300">
                                    <AvatarImage src={top3[2].avatar || undefined} />
                                    <AvatarFallback><UserIcon className="h-8 w-8 text-orange-400" /></AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-300 text-orange-900 px-3 py-0.5 text-xs font-black shadow-sm">
                                    #3
                                </div>
                            </div>
                            <h3 className="font-bold text-lg line-clamp-1">{top3[2].name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{top3[2].department || 'Learner'}</p>
                            <div className="bg-orange-100 dark:bg-orange-900/50 rounded-full px-4 py-1.5 font-bold text-orange-800 dark:text-orange-400 shadow-inner">
                                {top3[2].points} PTS
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Rest of the list */}
            {restUsers.length > 0 && (
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" /> Peringkat {top3.length + 1} - 50
                        </CardTitle>
                    </CardHeader>
                    <div className="divide-y divide-border">
                        {restUsers.map((user, index) => {
                            const rnk = index + 4
                            const isMe = user.id === currentUserId
                            return (
                                <div
                                    key={user.id}
                                    className={cn(
                                        "flex items-center gap-4 p-4 transition-colors hover:bg-muted/50",
                                        isMe && "bg-primary/5 hover:bg-primary/10"
                                    )}
                                >
                                    <div className="flex w-12 justify-center font-bold text-muted-foreground">
                                        #{rnk}
                                    </div>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar || undefined} />
                                        <AvatarFallback><UserIcon className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate flex items-center gap-2">
                                            {user.name}
                                            {isMe && <span className="text-[10px] uppercase font-black tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">You</span>}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">{user.department || 'Learner'}</p>
                                    </div>
                                    <div className="font-bold text-right pl-4">
                                        {user.points} <span className="text-xs text-muted-foreground font-normal">PTS</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            )}
        </div>
    )
}

function Users(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
