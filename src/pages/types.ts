// types.ts

export interface HistogramData {
  date: string;
  value: number;
}

export interface HistogramResult {
  data: HistogramData[];
  histogramType: string;
}

export interface DocumentAttributes {
  isTechNews: boolean;
  isAnnouncement: boolean;
  isDigest: boolean;
  influence: number;
  wordCount: number;
  coverage: {
    value: number;
    state: string;
  };
}

export interface DocumentOk {
  id: string;
  issueDate: string;
  title: { text: string };
  source: { name: string };
  content: { markup: string };
  url: string;
  attributes: DocumentAttributes; 
}

export interface SearchResultsData {
  data: HistogramResult[];
}
