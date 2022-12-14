//package/stateG
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { API } from "../../config/api";
import swal from 'sweetalert';

//component
import Button from "../../components/Atoms/button";
import Input from "../../components/Atoms/input";
import Layout from "../../components/layout";
import Navbar from "../../components/Navbar/navbar";

export default function Product() {
  
  //id&&state
  const router = useRouter();
  const id = router?.query?.product;
  const [preview, setPreview] = useState(null);
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });

    if (e.target.type === "file") {
      setPreview(e.target.files[0].name);
    }
  };

  useEffect(() => {
    const getData = async (e) => {
      try {
        const res = await API.get(`/product/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        });
        setInput({
          name: res.data.data.name,
          price: res.data.data.price,
          image: res.data.data.image,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.set("name", input.name);
      formData.set("price", input.price);
      formData.set("imagename", input.image);
      if (preview) {
        formData.set("image", input?.image, input?.image?.name);
      }

      const res = await API.patch(`/product/${id}`, formData);
      swal("success add product ");
      router.push("/list-product");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <Layout title="Add-Product">
        <Navbar />
        <div>
          <form
            onSubmit={(e) => handleSubmit.mutate(e)}
            className="my-12 mx-16"
          >
            <p className="font-extrabold text-4xl font-font_a mb-8 ">
              EDIT PRODUCT
            </p>

            <div className="grid ml-8 md:grid-cols-12 gap-2">
              <div className="grid col-span-8">
                <Input
                  style=""
                  type="text"
                  onChange={handleChange}
                  name="name"
                  defaultValue={input.name}
                  placeholder="name"
                />
              </div>
              <div className="grid col-span-4">
                <label
                  className="bg-fontPrimary h-10 hover:bg-fontPrimary/90 text-white w-full pt-2 text-center text-xs font-bold transition duration-300 rounded"
                  htmlFor="fileImage"
                >
                  <div className="text-white">
                    {preview ? preview : "Attach Image"}
                  </div>
                </label>
                <Input
                  hidden
                  name="image"
                  onChange={handleChange}
                  id="fileImage"
                  type="file"
                />
              </div>
              <div className="grid col-span-12">
                <Input
                  style=""
                  onChange={handleChange}
                  defaultValue={input.price}
                  name="price"
                  type="number"
                  placeholder="Price"
                />
              </div>
              <div className="grid col-span-8"></div>
              <div className="grid col-span-4">
                <Button
                  type="onsubmit"
                  style="h-8 bg-fontPrimary hover:bg-fontPrimary/80"
                >
                  oke
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
