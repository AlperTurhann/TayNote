import { PageTemplate } from '@/components/base/PageTemplate';
import { BoardList } from '@/components/BoardList';

const Home = () => {
  return (
    <PageTemplate>
      <div className="flex min-h-0 flex-1 justify-center text-base-300">
        <BoardList />
      </div>
    </PageTemplate>
  );
};

export default Home;
