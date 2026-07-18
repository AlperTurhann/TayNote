import { PageTemplate } from '@/components/base/PageTemplate';
import { Board } from '@/components/Board';
import { TaskSearchBar } from '@/components/SearchBar';

const Home = () => {
  return (
    <PageTemplate>
      <h1 className="text-center font-bold text-3xl text-base-100">TayNote</h1>
      <TaskSearchBar />
      <Board />
    </PageTemplate>
  );
};

export default Home;
