export default function ShowError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-4xl font-bold text-red-600">Error</h1>
      <p className="mt-4 text-lg text-gray-700">{error.message}</p>
      <pre className="mt-2 p-4 bg-gray-100 rounded border border-gray-300 w-full overflow-auto">
        {error.stack}
      </pre>
    </div>
  );
}
