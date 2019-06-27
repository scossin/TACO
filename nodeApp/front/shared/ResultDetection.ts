

export interface Detection {
    cts: Array<CT>,
    sentence: string,
    signalDetected: boolean
}

export interface SentenceDetection {
    start: number,
    end: number,
    content: string,
    phraseNumber: number
    detectionSentence: Detection
}

export interface CT {
    term: string,
    normalizeTerm: string,
    start: number,
    end: number,
    code: string,
    dictLabel: string,
    termino: string
}