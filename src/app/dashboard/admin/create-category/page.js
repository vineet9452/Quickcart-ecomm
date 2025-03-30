"use client";

import { useEffect, useState, useRef } from "react";
import AdminMenu from "@/app/components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "@/app/components/Form/CategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "@/Redux/Slices/authSlices";
import { Modal, Input, Button } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  // const modalRef = useRef(null);

  useEffect(() => {
    dispatch(loadUser());
    getAllCategory();
  }, [dispatch]);

  // API Call to get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/get-category`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  // Create Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("User is not authorized");
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/create-category`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(`${data.category.name} created`);
        getAllCategory();
        setName("");
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  // 🔹 Edit Modal Open करने का फंक्शन
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setUpdatedName(category.name);
    setIsModalOpen(true);
  };

  // 🔹 Modal को बंद करने का फंक्शन
  const handleCancel = () => {
    setIsModalOpen(false);
    setUpdatedName("");
    setSelectedCategory(null);
  };

  // 🔹 Update Category Function
  const handleUpdate = async () => {
    if (!token || !selectedCategory) {
      toast.error("User is not authorized");
      return;
    }

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/update-category/${selectedCategory._id}`,
        { name: updatedName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(`${updatedName} updated successfully`);
        getAllCategory(); // ✅ Updated Categories लोड करें
        handleCancel(); // ✅ Modal बंद करें
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!token) return toast.error("User is not authorized");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/delete-category/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Category deleted successfully");
      getAllCategory();
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  return (
    <>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Categories</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>
                          <Button
                            type="primary"
                            onClick={() => openEditModal(c)}
                            className="mx-2"
                          >
                            Edit
                          </Button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No categories found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Modal */}
      <Modal
        title="Edit Category"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdate}>
            Save Changes
          </Button>,
        ]}
      >
        <Input
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          placeholder="Enter category name"
        />
      </Modal>
    </>
  );
};

export default CreateCategory;
