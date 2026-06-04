const [data, setData] = useState<DriverProfileResponse | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadDriver = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/drivers/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load driver");
      }

      const result = await response.json();

      setData(result);
    } catch (err) {
      setError("Failed to load driver profile");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    loadDriver();
  }
}, [id]);
