export default function Page({
  searchParams,
}: {
  searchParams: { subDomain: string };
}) {
  return <div>subDomain: {searchParams.subDomain}</div>;
}
