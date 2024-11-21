/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: any } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log(
    'currentUser',
    currentUser?.role?.find((role: string) => ['client'].includes(role)),
  );
  return {
    canAdmin: currentUser && currentUser?.role?.find((role: string) => ['admin'].includes(role)),
    canClient: currentUser && currentUser?.role?.find((role: string) => ['client'].includes(role)),
    canSale: currentUser && currentUser?.role?.find((role: string) => ['sale'].includes(role)),
    canEditor: currentUser && currentUser?.role?.find((role: string) => ['editor'].includes(role)),
    canTask: currentUser && currentUser?.role?.find((role: string) => ['task'].includes(role)),
    canApprove:
      currentUser && currentUser?.role?.find((role: string) => ['approve'].includes(role)),
  };
}
