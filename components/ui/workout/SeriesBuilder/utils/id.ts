// RN-safe id (or import your global id() if you prefer)
export const rid = () => Math.random().toString(36).slice(2, 10).toUpperCase();
