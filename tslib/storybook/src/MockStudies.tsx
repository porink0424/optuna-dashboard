import { useEffect, useState } from "react";
import { loadStorageFromFile } from "./utils/loadStorageFromFile";

const fetchMockStudies = async () => {
  const filePath = "db.sqlite3";
  const res = await fetch(filePath);
  const blob = await res.blob();
  const file = new File([blob], filePath);
  const mockStudies: Study[] = [];
  await loadStorageFromFile(file, (value) => {
    if (Array.isArray(value)) {
      mockStudies.push(...value);
    } else {
      mockStudies.push(...value([]));
    }
  });
  return mockStudies;
};

const useMockStudies = () => {
  const [mockStudies, setMockStudies] = useState<Study[]>([]);
  useEffect(() => {
    fetchMockStudies().then((studies) => setMockStudies(studies));
  }, []);
  return mockStudies;
};

export const useMockStudy = (studyId: number | undefined) => {
  const mockStudies = useMockStudies();
  return mockStudies.find((study) => study.study_id === studyId);
};