import PageTemplate from '@/components/PageTemplate';
import TaskList from '@/components/TaskList';
import TaskSearchBar from '@/components/TaskSearchBar';

const Home = () => {
  return (
    <PageTemplate>
      <h1 className="text-center font-bold text-3xl text-base-100">TayNote</h1>
      <TaskSearchBar />
      <TaskList />
    </PageTemplate>
  );
};

export default Home;
