// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { addToCart } from "@/Redux/Slices/cartSlices";
// import Image from "next/image";
// import { toast } from "react-hot-toast"; // ✅ Hot Toast Import किया

// const ProductDetails = () => {
//   const { slug } = useParams();
//   const [product, setProduct] = useState({});
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     if (slug) getProduct();
//   }, [slug]);

//   const getProduct = async () => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`
//       );
//       setProduct(data?.product);
//       getSimilarProduct(data?.product._id, data?.product.category?._id);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     }
//   };

//   const getSimilarProduct = async (pid, cid) => {
//     if (!pid || !cid) return;
//     try {
//       const { data } = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/products/related-product/${pid}/${cid}`
//       );
//       setRelatedProducts(data?.products || []);
//     } catch (error) {
//       console.error("Error fetching related products:", error);
//     }
//   };

//   const handleAddToCart = (item) => {
//     dispatch(addToCart(item));
//     toast.success(`${item.name} added to cart!`); // ✅ Hot Toast Notification
//   };

//   return (
//     <div className="container my-5">
//       {/* ✅ Product Details Section */}
//       <div className="row align-items-center">
//         <div className="col-lg-6 text-center">
//           {product._id && (
//             <Image
//               src={`${process.env.NEXT_PUBLIC_API_URL}/api/products/product-photo/${product._id}`}
//               className="img-fluid shadow-lg rounded"
//               alt={product.name}
//               width={400}
//               height={400}
//             />
//           )}
//         </div>

//         <div className="col-lg-6">
//           <h1 className="fw-bold">{product.name}</h1>
//           <p className="text-muted">{product.description}</p>

//           <h4 className="text-danger fw-bold my-3">&#8377; {product.price}</h4>

//           <p className="fw-bold">
//             Category:{" "}
//             <span className="badge bg-primary text-white">
//               {product.category?.name || "No Category"}
//             </span>
//           </p>

//           <p className="fw-bold">
//             🚚 Shipping:{" "}
//             <span
//               className={`badge ${
//                 product.shipping ? "bg-success" : "bg-danger"
//               }`}
//             >
//               {product.shipping ? "Available" : "Not Available"}
//             </span>
//           </p>

//           <button
//             className="btn btn-warning btn-lg shadow-sm px-4 mt-3"
//             onClick={() => handleAddToCart(product)}
//           >
//             🛒 Add to Cart
//           </button>
//         </div>
//       </div>

//       {/* ✅ Similar Products Section */}
//       <div className="mt-5">
//         <h2 className="fw-bold text-center mb-4">Similar Products</h2>

//         {relatedProducts.length < 1 ? (
//           <p className="text-center text-muted">No Similar Products Found</p>
//         ) : (

//           <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
//             {relatedProducts.map((p) => (
//               <div className="col" key={p._id}>
//                 <div
//                   className="card shadow-sm border-0 rounded text-center p-3"
//                   style={{ minHeight: "22rem" }}
//                 >
//                   <Image
//                     src={`${
//                       process.env.NEXT_PUBLIC_API_URL
//                     }/api/products/product-photo/${
//                       p._id
//                     }?t=${new Date().getTime()}`}
//                     alt={p.name}
//                     width={150}
//                     height={150}
//                     priority
//                     style={{
//                       width: "100%",
//                       height: "350px",
//                       objectFit: "cover",
//                       borderRadius: "10px",
//                     }}
//                   />
//                   <div className="card-body d-flex flex-column justify-content-between">
//                     <h6 className="card-title text-dark fw-bold">{p.name}</h6>
//                     <p className="text-muted small">
//                       {p.description.substring(0, 30)}...
//                     </p>
//                     <p className="text-danger fw-bold">&#8377; {p.price}</p>

//                     <div className="d-flex justify-content-center gap-2">
//                       <button
//                         className="btn btn-sm btn-warning px-3"
//                         onClick={() => handleAddToCart(p)}
//                       >
//                         🛒 Add
//                       </button>
//                       <button
//                         className="btn btn-sm btn-primary px-3"
//                         onClick={() => router.push(`/product/${p.slug}`)}
//                       >
//                         🔍 View
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;




import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/Slices/cartSlices";
import Image from "next/image";
import { toast } from "react-hot-toast";

const ProductDetails = ({ product, relatedProducts }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="container my-5">
      {/* ✅ Product Details Section */}
      <div className="row align-items-center">
        <div className="col-lg-6 text-center">
          {product._id && (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/products/product-photo/${product._id}`}
              className="img-fluid shadow-lg rounded"
              alt={product.name}
              width={400}
              height={400}
            />
          )}
        </div>

        <div className="col-lg-6">
          <h1 className="fw-bold">{product.name}</h1>
          <p className="text-muted">{product.description}</p>

          <h4 className="text-danger fw-bold my-3">&#8377; {product.price}</h4>

          <p className="fw-bold">
            Category:{" "}
            <span className="badge bg-primary text-white">
              {product.category?.name || "No Category"}
            </span>
          </p>

          <p className="fw-bold">
            🚚 Shipping:{" "}
            <span
              className={`badge ${
                product.shipping ? "bg-success" : "bg-danger"
              }`}
            >
              {product.shipping ? "Available" : "Not Available"}
            </span>
          </p>

          <button
            className="btn btn-warning btn-lg shadow-sm px-4 mt-3"
            onClick={() => handleAddToCart(product)}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* ✅ Similar Products Section */}
      <div className="mt-5">
        <h2 className="fw-bold text-center mb-4">Similar Products</h2>

        {relatedProducts.length < 1 ? (
          <p className="text-center text-muted">No Similar Products Found</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {relatedProducts.map((p) => (
              <div className="col" key={p._id}>
                <div
                  className="card shadow-sm border-0 rounded text-center p-3"
                  style={{ minHeight: "22rem" }}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/products/product-photo/${p._id}`}
                    alt={p.name}
                    width={150}
                    height={150}
                    priority
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h6 className="card-title text-dark fw-bold">{p.name}</h6>
                    <p className="text-muted small">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="text-danger fw-bold">&#8377; {p.price}</p>

                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-warning px-3"
                        onClick={() => handleAddToCart(p)}
                      >
                        🛒 Add
                      </button>
                      <button
                        className="btn btn-sm btn-primary px-3"
                        onClick={() =>
                          window.location.assign(`/product/${p.slug}`)
                        }
                      >
                        🔍 View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`
    );
    const product = res.data?.product;

    let relatedProducts = [];
    if (product?._id && product?.category?._id) {
      const relatedRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/related-product/${product._id}/${product.category._id}`
      );
      relatedProducts = relatedRes.data?.products || [];
    }

    return {
      props: {
        product,
        relatedProducts,
      },
    };
  } catch (error) {
    console.error("SSR Error:", error.message);
    return {
      notFound: true,
    };
  }
}

