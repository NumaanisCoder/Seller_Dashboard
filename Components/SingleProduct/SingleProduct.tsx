import React from 'react';
import style from './SingleProductStyle.module.css';
import Link from 'next/link';
import { MdMoreVert } from 'react-icons/md';

// Define a more specific type for the images
type Image = {
  imageurl: string;
};

type ProductData = {
  no: number;
  name: string;
  images: Image[];  // More specific typing for images
  stocks: string;
  price: number;
  _id: string;
};

type SingleProductProps = {
  data: ProductData;
  no: number;
};

const SingleProduct: React.FC<SingleProductProps> = ({ data, no }) => {
  const { name, images, stocks, price, _id } = data;

  return (
    <div className={style.BodyContainer}>
      <span className={style.no}>{no}</span>
      <span className={style.image}>
        {images.length > 0 ? (
          <img src={images[0].imageurl} alt={name} />
        ) : (
          <img src="/placeholder.jpg" alt="No Image" /> // Fallback in case no image
        )}
      </span>
      <span className={style.name}>{name}</span>
      <span className={style.stock}>{stocks}</span>
      <span className={style.price}>₹{price}</span>
      <span className={style.more}>
        <span className={style.colon}><MdMoreVert /></span>
        <div className={style.menuCard}>
          <Link href={`/${_id}/edit`}>Edit</Link>
          <Link href={`/${_id}/delete`}>Delete</Link>
        </div>
      </span>
    </div>
  );
};

export default SingleProduct;
