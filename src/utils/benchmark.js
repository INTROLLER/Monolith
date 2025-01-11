let results = []

function benchmark(start, end) {
  const duration = end - start;
  results.push(duration)
  let sum = 0
  results.forEach((result) => {
    sum += result
  })

  const average = sum / results.length
  console.log(`${average}ms`);
}

module.exports = {
  benchmark
}