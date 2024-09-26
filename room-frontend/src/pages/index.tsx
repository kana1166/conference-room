import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div className="bg-[url('/images/image-top.jpeg')] bg-cover bg-center w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">
        会議室予約システムへようこそ！
      </h1>
      <div className="bg-white bg-opacity-80  m-10 rounded-lg">
        <p className="text-lg text-gray-700">
          ここで最適な会議室を見つけ、簡単に予約ができます。
        </p>
      </div>
      <div className="space-y-4">
        <Link href="/login">
          <div className="m-10 px-4 py-2 border border-gray-700 bg-gray-500 text-white hover:bg-gray-600 transition duration-300 ease-in-out text-center">
            ログインページ
          </div>
        </Link>
        <Link href="/guestPage">
          <div className="m-10 px-4 py-2 border border-gray-700 bg-gray-500 text-white hover:bg-gray-600 transition duration-300 ease-in-out">
            ゲストの方はこちら
          </div>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
