import { PageTemplate } from '@/components/base/PageTemplate';
import { Board } from '@/components/Board';

interface Props {
  params: Promise<{ boardId: string }>;
}

const BoardPage = async ({ params }: Props) => {
  const { boardId } = await params;

  return (
    <PageTemplate>
      <Board boardId={boardId} />
    </PageTemplate>
  );
};

export default BoardPage;
