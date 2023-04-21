import dbConnect from "../../../../db/connect";
import Place from "../../../../db/models/Place";


export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;


  if (request.method === "GET") {
    const place = await Place.findById(id)

    if (!place) {
      return response.status(404).json({ status: 'Not found' });
    }

    response.status(200).json(place);
  }

  if (request.method === "PATCH") {
    await Place.findByIdAndUpdate(id, {
      $set: request.body,
    });

    return response.status(200).json({ status: "Place is updated" });
  }

  if (request.method === "DELETE") {
    try {
      await Place.findByIdAndDelete(id);
      return response.status(200).json({ status: "Place is deleted" });
    } catch (error) {
      return response.status(400).json({ status: error.message });
    }
  }

}
