import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import style from '@/styles/productCreationStyle.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

interface IFormInput {
  name: string;
  description: string;
  price: number;
  stocks: number;
  category: string;
  subCategory: string;
  status: string;
  images: FileList;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
}

interface CreateProductProps {
  data: Category[];
}

const CreateProduct: React.FC<CreateProductProps> = ({ data }) => {
  console.log(data); // For checking the received categories and subcategories data
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
  const router = useRouter();
  const [ButtonText, setButtonText] = useState('Create Product');
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Track selected category
  const [files, setFiles] = useState<FileList | null>(null);

  // Watch the selected category to filter subcategories
  const watchCategory = watch('category');

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    
    setButtonText('Creating...');
    const tokenOfSellerID = Cookies.get('authtokenbyan');
    
    const newProductData = new FormData();

    newProductData.append("name", formData.name);
    newProductData.append("description", formData.description);
    newProductData.append("price", formData.price.toString());
    newProductData.append("stocks", formData.stocks.toString());
    newProductData.append("category", formData.category);
    newProductData.append("subCategory", formData.subCategory);
    newProductData.append("status", formData.status);
    newProductData.append("tokenOfSellerID", tokenOfSellerID ? tokenOfSellerID :"");

    // Append multiple files to FormData
    if (files) {
      Array.from(files).forEach((file) => {
        newProductData.append('images', file);
      });
    }

    console.log("Original",data);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/createproduct`,
        newProductData
      );

      if (response.data.success) {
        alert('Product created successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating product');
    } finally {
      setButtonText('Create Product');
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value); // Update selected category
  };

  // Get subcategories for the selected category
const subCategories = data.find((category) => category.name === selectedCategory)?.subCategories || [];

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Create Product</h1>

        <div className={style.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            id="name"
            maxLength={30}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            multiple // Allow multiple file selection
            accept="image/jpeg, image/png, image/webp" // Restrict to JPEG and PNG files
            onChange={(e) => {
              setFiles(e.target.files); // Store multiple files in state
            }}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            id="description"
          />
          {errors.description && <span>{errors.description.message}</span>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            {...register('price', { required: 'Price is required' })}
            id="price"
          />
          {errors.price && <span>{errors.price.message}</span>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="stocks">Stocks</label>
          <input
            type="number"
            {...register('stocks', { required: 'Stocks are required' })}
            id="stocks"
          />
          {errors.stocks && <span>{errors.stocks.message}</span>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="category">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {data.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span>{errors.category.message}</span>}
        </div>

        {subCategories.length > 0 && (
          <div className={style.formGroup}>
            <label htmlFor="subCategory">SubCategory</label>
            <select {...register('subCategory', { required: 'SubCategory is required' })}>
              <option value="">Select a subcategory</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory.name}>
                  {subCategory.name}
                </option>
              ))}
            </select>
            {errors.subCategory && <span>{errors.subCategory.message}</span>}
          </div>
        )}

        <div className={style.formGroup}>
          <label htmlFor="status">Status</label>
          <select {...register('status')}>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div className={style.formGroup}>
          <button type="submit">{ButtonText}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

// Fetch categories server-side
export async function getServerSideProps() {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category/getcategories`);
  const categories = response.data.categories;

  return {
    props: {
      data: categories, // Pass categories data to the component
    },
  };
}
