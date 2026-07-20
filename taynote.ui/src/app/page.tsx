import { PageTemplate } from '@/components/base/PageTemplate';
import { BoardList } from '@/components/BoardList';

const Home = () => {
  return (
    <PageTemplate>
      <div className="h-full flex justify-center text-base-400">
        <BoardList />
      </div>
    </PageTemplate>
  );
};

export default Home;
