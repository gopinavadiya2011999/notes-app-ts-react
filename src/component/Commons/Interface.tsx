interface Todo {
  id: string;
  userId: string;
  note: string;
  title: string;
  image: string;
  reminder: string;
  updateAt: {
    seconds: number;
    nanoseconds: number;
  };
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export default Todo;
