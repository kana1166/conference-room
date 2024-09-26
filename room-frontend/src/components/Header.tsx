import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-200 py-4  flex justify-end  items-center ">
      <ul className="flex space-x-6 mr-20 ">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/Executive">重役専用ページ</Link>
        </li>
        <li>
          <Link href="http://54.87.195.13:8501/">会議室管理</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
