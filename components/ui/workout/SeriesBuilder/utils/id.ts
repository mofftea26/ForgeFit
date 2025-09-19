// RN-safe id (or import your own shared id generator)
export const rid = () => Math.random().toString(36).slice(2, 10).toUpperCase();
