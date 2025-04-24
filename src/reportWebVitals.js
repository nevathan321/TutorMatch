/**
 * Group Members: Nevathan, Liyu, Adrian, Abishan
 * Date: April 20, 2025
 *
 * Description:
 * This utility file is used to measure and report web performance metrics
 * for the application using the web-vitals library. These metrics can help
 * identify bottlenecks in rendering, interactivity, and overall page load
 * performance. It exports a single function that logs or sends performance data.
 */


const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
