import { getMyProfile } from '@/lib/actions/account'
import { AccountSettingsForm } from '@/components/shared/account-settings-form'

export default async function BackofficeAccountPage() {
    const user = await getMyProfile()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h1>
                <p className="text-muted-foreground">
                    Kelola informasi profil dan keamanan akun Anda
                </p>
            </div>

            <AccountSettingsForm user={user} />
        </div>
    )
}
