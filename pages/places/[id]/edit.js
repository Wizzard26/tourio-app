import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import Form from '../../../components/Form.js';
import { StyledLink } from '../../../components/StyledLink.js';
import useSWRMutation from "swr/mutation";


async function sendRequest(url, { arg }) {

  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(arg),
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    console.error("Something went wrong!");
  }
}

export default function EditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;
  const { data: place, isLoading, error } = useSWR(`/api/places/${id}`);


  const { trigger, isMutating } = useSWRMutation(
    `/api/places/${id}`,
    sendRequest
  );

  async function editPlace(place) {

    const formData = new FormData(event.target);
    const placeData = Object.fromEntries(formData);

    await trigger(placeData);

    await router.push("/");
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <>
      <h2 id="edit-place">Edit Place</h2>
      <Link href={`/places/${id}`} passHref legacyBehavior>
        <StyledLink justifySelf="start">back</StyledLink>
      </Link>
      <Form onSubmit={editPlace} formName={'edit-place'} defaultData={place} />
    </>
  );
}
