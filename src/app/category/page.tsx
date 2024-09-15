export default function Category() {
  return null; // This will not render anything since we are redirecting
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/collection",
      permanent: false, // Set true if this is a permanent redirect (301)
    },
  };
}
