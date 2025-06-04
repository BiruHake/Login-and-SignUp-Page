import { useForm } from "react-hook-form";
import react, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { useState } from "react";
function Dashboard() {
  const { register, handleSubmit, reset } = useForm();
  let [popUp, setPopUp] = useState(false);
  const [items, setItems] = useState([]);
  const [editmode, setEditmode] = useState(false);
  const [editid, setEditid] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/Login-and-SignUp-Page/showList")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.items);
        } else {
          console.error("Failed to fetch items");
        }
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  //delete
  const deleteItem = async (id) => {
    const res = await fetch(
      `http://localhost:3000/Login-and-SignUp-Page/delete/${id}`,
      {
        method: "delete",
        headers: { "content-type": "application/json" },
      }
    );
    const deleteData = await res.json();
    if (deleteData.success) {
      toast.success(deleteData.message || "delete item success");
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } else {
      toast.error(deleteData.message || "failed");
    }
  };

  // update
  const handleClick = (item) => {
    setEditmode(true);
    setEditid(item.id);
    reset(item);
    setPopUp(true);
  };

  //insert the data
  const onsubmit = async (data) => {
    try {
      if (editmode) {
        const res = await fetch(
          `http://localhost:3000/Login-and-SignUp-Page/update/${editid}`,
          {
            method: "put",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const updatedData = await res.json();
        if (updatedData.success) {
          toast.success(updatedData.message || "Successfully update...!");
          setItems((prev) =>
            prev.map((item) =>
              item.id === updatedData.insertedItem.id
                ? updatedData.insertedItem
                : item
            )
          );
          setPopUp(false);
          reset();
          setEditmode(false);
        } else {
          toast.error(updatedData.message || "failed...");
        }
      } else {
        const res = await fetch(
          "http://localhost:3000/Login-and-SignUp-Page/showList",
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        // fetch response
        const data1 = await res.json();
        if (data1.success) {
          toast.success(data1.message || "Data store successfully...!");
          setItems((prev) => [...prev, data1.insertedItem]);
          setPopUp(false);
          reset();
        } else {
          toast.error(data1.message || "failed...");
        }
      }
    } catch (err) {
      toast.error("Server error, please try again.");
    }
  };

  return (
    <>
      <nav className="	bg-slate-800 w-full h-[50px]">
        <h1 className="bg-gradient-to-r from-purple-400 via-pink-600 to-red-700 bg-clip-text text-transparent font-bold text-4xl pl-2">Inventory Management</h1>
        <button
          className="fixed top-1 right-1 bg-blue-600 text-white"
          id="popUp"
          onClick={() => {
            setPopUp(true), setEditmode(false), reset();
          }}
        >
          Add +
        </button>
      </nav>

      <table cellPadding="5" cellSpacing="0" className="item-table">
        <thead>
          <tr className="bg-black text-white">
            <td className="td">Item Name</td>
            <td className="td">Price</td>
            <td className="td">Quantity</td>
            <td className="td">Description</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td className="td">{item.name}</td>
                <td className="td">{item.price}</td>
                <td className="td">{item.quantity}</td>
                <td className="td">{item.description}</td>
                <td className="td">
                  <button
                    className="text-blue-700"
                    onClick={() => handleClick(item)}
                  >
                    edit
                  </button>
                </td>
                <td className="td">
                  <button
                    className="text-blue-700"
                    onClick={() => deleteItem(item.id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No items found</td>
            </tr>
          )}
        </tbody>
      </table>

      {popUp ? (
        <div className="py-[50px] px-[30px] bg-white shadow-2xl PopUp transition duration-700 ease-in-out">
          <p
            className="close"
            onClick={() => {
              reset();
              setPopUp(false);
            }}
          >
            &#x2716;
          </p>
          <form onSubmit={handleSubmit(onsubmit)}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="itemname">Item Name :</label>
                  </td>
                  <td>
                    <input
                      className="border-1 p-1 rounded-xl w-full"
                      {...register("name", { required: true, maxLength: 20 })}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="price"> Price :</label>
                  </td>
                  <td>
                    <input
                      className="border-1 p-1 rounded-xl w-full"
                      {...register("price", { required: true, maxLength: 20 })}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="quantity">Quantity :</label>
                  </td>
                  <td>
                    <input
                      className="border-1 p-1 rounded-xl w-full"
                      {...register("quantity", {
                        required: true,
                        maxLength: 20,
                      })}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="description">Description :</label>
                  </td>
                  <td>
                    <textarea rows={3} cols={50}
                      className="border-1 p-1 rounded-xl"
                      {...register("description")}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="relative">
                    <button
                      className=" bg-blue-600 text-white absolute right-0"
                      type="submit"
                    >
                      {editmode ? "Update Item" : "Add Item"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      ) : (
        ""
      )}
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </>
  );
}
export default Dashboard;
