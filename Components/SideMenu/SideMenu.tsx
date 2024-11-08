import Link from 'next/link';
import style from './SideMenu.module.css';
import { FiHome } from 'react-icons/fi'; // Dashboard Icon
import { FaBoxOpen, FaTags, FaWarehouse, FaUserFriends } from 'react-icons/fa'; // Orders, Products Icons
import { MdSupportAgent } from 'react-icons/md'; // Customer Support Icon

function SideMenu() {
    return (
        <div className={style.container}>
            <ul className={style.linkContainer}>
                <li><Link href="/" ><FiHome width={20}/> DashBoard</Link></li>
                <li><Link href="/orders" ><FaBoxOpen width={20}/>Orders</Link></li>
                <li><Link href="/products" ><FaTags width={20} />Products</Link></li>
                <li><Link href="/inventory" ><FaWarehouse width={20} />Inventory</Link></li>
                <li><Link href="/createproduct" ><FaWarehouse width={20} />Create New Product</Link></li>
                <li><Link href="/customer" ><FaUserFriends width={20}/>Customer</Link></li>
                <li><Link href="/support" ><MdSupportAgent width={20} />Support</Link></li>
                <li><Link href="/account" ><MdSupportAgent width={20} />Account</Link></li>
            </ul>
        </div>
    )
}

export default SideMenu;