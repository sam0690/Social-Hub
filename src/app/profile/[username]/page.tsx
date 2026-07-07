import UserProfilePageClient from "@/components/profile/UserProfilePageClient";

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;
    return <UserProfilePageClient username={username} />;
}
