import { getMyProfile } from '@/lib/actions/account'
import { AccountSettingsForm } from '@/components/shared/account-settings-form'

export default async function BackofficeAccountPage() {
    const profile = await getMyProfile()

    return (
        <div className="container py-6">
            <AccountSettingsForm profile={profile} />
        </div>
    )
}
