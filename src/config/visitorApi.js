// Shared endpoint for the visitor map and statistics page.
const VISITOR_API_URL = (process.env.REACT_APP_VISITOR_MAP_API_URL || '').replace(/\/$/, '');

export default VISITOR_API_URL;
