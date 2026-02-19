export const getOrCreateFingerprint = (): string => {
    if (typeof window === 'undefined') return '';

    const STORAGE_KEY = 'rf_voter_id';
    let fingerprint = localStorage.getItem(STORAGE_KEY);

    if (!fingerprint) {
        fingerprint = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, fingerprint);
    }

    return fingerprint;
};
