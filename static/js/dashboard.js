document.addEventListener('DOMContentLoaded', function() {
    // Base URL for API (can be changed if needed)
    const BASE_URL = window.location.origin;

    // Initialize tooltips and popovers
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', function() {
        document.body.classList.toggle('sidebar-toggled');
    });

    // Handle back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Handle smooth scrolling for navigation links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Update active state in sidebar
            document.querySelectorAll('.sidebar .nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');

            // Scroll to the section
            window.scrollTo({
                top: targetElement.offsetTop - 60,
                behavior: 'smooth'
            });

            // Close sidebar on mobile after navigation
            if (window.innerWidth < 992) {
                document.body.classList.remove('sidebar-toggled');
            }
        });
    });

    // Helper function to generate a range of colors
    function generateColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = i * (360 / count);
            colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
        }
        return colors;
    }

    // Helper to get darker border colors
    function getBorderColors(backgroundColors) {
        return backgroundColors.map(color =>
            color.replace('0.7', '0.9').replace('0.6', '0.8').replace('0.5', '0.7')
        );
    }

    // Helper function to show loading indicator
    function showLoading(chartId) {
        const loadingOverlay = document.querySelector(`#${chartId}-container .loading-overlay`);
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    // Helper function to hide loading indicator
    function hideLoading(chartId) {
        const loadingOverlay = document.querySelector(`#${chartId}-container .loading-overlay`);
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // Helper function to show error
    function showError(chartId, message) {
        hideLoading(chartId);
        const chartWrapper = document.querySelector(`#${chartId}-container .chart-wrapper`);
        if (chartWrapper) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message || 'Failed to load chart data';
            chartWrapper.appendChild(errorElement);
        } else {
            console.warn(`Chart wrapper for ${chartId} not found. Cannot display error message.`);
        }
    }

    // Function to fetch data and render all charts
    async function fetchDataAndRenderCharts() {
        try {
            // --- Chart 1: Average CTC per Skill (Bar) ---
            await renderChart1();

            // --- Chart 2: Company Count per Skill (Bar) ---
            await renderChart2();

            // --- Chart 3: Company Count per Location (Bar) ---
            await renderChart3();

            // --- Chart 6: Line chart Avg CTC across Skills ---
            await renderChart6();

            // --- Chart 7: Pie chart Skill Demand ---
            await renderChart7();

            // --- Chart 8: Pie chart Location Distribution ---
            await renderChart8();

            // --- Chart 9: Avg CTC per Location (Bar) ---
            await renderChart9();

            // --- Chart 10: Scatter plot CTC vs Avg CTC ---
            await renderChart10();

            // --- Chart 11: Heatmap Skill vs Location ---
            // Chart 11 has its own existence check in the renderChart11 function
            await renderChart11();

            // --- Chart 12: Stacked bar chart Skills per Location ---
            await renderChart12();

            // --- Chart 13: Bubble Chart Company vs CTC ---
            await renderChart13();

        } catch (error) {
            console.error("Error rendering charts:", error);
        }
    }

    // Individual chart rendering functions
    async function renderChart1() {
        const chartId = 'chart1_avg_ctc_per_skill';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/1_avg_ctc_per_skill`)).json();
            let bgColors = generateColors(data.labels.length);
            hideLoading(chartId);

            new Chart(document.getElementById(chartId), {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Average CTC',
                        data: data.values,
                        backgroundColor: bgColors,
                        borderColor: getBorderColors(bgColors),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Average CTC (₹)'
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 1:", error);
            showError(chartId);
        }
    }

    async function renderChart2() {
        const chartId = 'chart2_company_count_per_skill';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/2_company_count_per_skill`)).json();
            let bgColors = generateColors(data.labels.length);
            hideLoading(chartId);

            new Chart(document.getElementById(chartId), {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Number of Companies',
                        data: data.values,
                        backgroundColor: bgColors,
                        borderColor: getBorderColors(bgColors),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Companies'
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 2:", error);
            showError(chartId);
        }
    }

    async function renderChart3() {
        const chartId = 'chart3_company_count_per_location';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/3_company_count_per_location`)).json();
            let bgColors = generateColors(data.labels.length);
            hideLoading(chartId);

            new Chart(document.getElementById(chartId), {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Number of Companies',
                        data: data.values,
                        backgroundColor: bgColors,
                        borderColor: getBorderColors(bgColors),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Companies'
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 3:", error);
            showError(chartId);
        }
    }

    async function renderChart6() {
        const chartId = 'chart6_line_avg_ctc_skills';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/6_line_avg_ctc_skills`)).json();
            hideLoading(chartId);

            new Chart(document.getElementById(chartId), {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Average CTC',
                        data: data.values,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Average CTC (₹)'
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 6:", error);
            showError(chartId);
        }
    }

    async function renderChart7() {
        const chartId = 'chart7_pie_skill_demand';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/7_pie_skill_demand`)).json();
            let total = data.values.reduce((a, b) => a + b, 0);
            let bgColors = generateColors(data.labels.length);
            hideLoading(chartId);

            new Chart(document.getElementById(chartId), {
                type: 'pie',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Skill Demand',
                        data: data.values,
                        backgroundColor: bgColors,
                        borderColor: getBorderColors(bgColors),
                        borderWidth: 1,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            align: 'start',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    let value = context.parsed;
                                    let percentage = ((value / total) * 100).toFixed(2);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 7:", error);
            showError(chartId);
        }
    }

    async function renderChart8() {
        const chartId = 'chart8_pie_location_distribution';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/8_pie_location_distribution`)).json();
            const total = data.values.reduce((sum, val) => sum + val, 0);
            let bgColors = generateColors(data.labels.length);
            hideLoading(chartId);

            new Chart(document.getElementById(chartId), {
                type: 'pie',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: data.tooltip_label || 'Job Listings',
                        data: data.values,
                        backgroundColor: bgColors,
                        borderColor: getBorderColors(bgColors),
                        borderWidth: 1,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Job Distribution by Location',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            position: 'right',
                            align: 'start',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const tooltipLabel = data.tooltip_label || 'Job Listings';
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const percent = ((value / total) * 100).toFixed(2);
                                    return `${label}: ${value} ${tooltipLabel} (${percent}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 8:", error);
            showError(chartId);
        }
    }

    async function renderChart9() {
        const chartId = 'chart9_avg_ctc_per_location';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/9_avg_ctc_per_location`)).json();
            let bgColors = generateColors(data.labels.length);
            hideLoading(chartId);

            new Chart(document.getElementById(chartId), {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Average CTC',
                        data: data.values,
                        backgroundColor: bgColors,
                        borderColor: getBorderColors(bgColors),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Average CTC (₹)'
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 9:", error);
            showError(chartId);
        }
    }

    async function renderChart10() {
        const chartId = 'chart10_scatter_ctc_vs_avg';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/10_scatter_ctc_vs_avg`)).json();
            hideLoading(chartId);

            // Process data for scatter plot
            const skills = [...new Set(data.map(item => item.skill))];
            const datasets = skills.map((skill, index) => {
                const skillData = data.filter(item => item.skill === skill);
                const color = `hsl(${index * (360 / skills.length)}, 70%, 60%)`;

                return {
                    label: skill,
                    data: skillData.map(item => ({
                        x: item.avg_ctc,
                        y: item.ctc,
                        company: item.company // Store company name for tooltip
                    })),
                    backgroundColor: color,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }
            });

            new Chart(document.getElementById(chartId), {
                type: 'scatter',
                data: {
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'CTC vs Average CTC by Skill (Top 100 Companies)',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const skill = context.dataset.label || '';
                                    const company = context.raw.company || '';
                                    const xValue = context.parsed.x;
                                    const yValue = context.parsed.y;

                                    // Format as Indian rupees (lakhs)
                                    const formattedCTC = (yValue / 100000).toFixed(2) + ' Lakhs';
                                    const formattedAvg = (xValue / 100000).toFixed(2) + ' Lakhs';

                                    return [
                                        `Company: ${company}`,
                                        `Skill: ${skill}`,
                                        `CTC: ₹${formattedCTC}`,
                                        `Avg CTC for ${skill}: ₹${formattedAvg}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Average CTC for Skill (₹)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value;
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Individual CTC (₹)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 10:", error);
            showError(chartId);
        }
    }

    // async function renderChart11() {
    //     const chartId = 'chart11_heatmap_skill_location';
    //     showLoading(chartId);
    //     try {
    //         let data = await (await fetch(`${BASE_URL}http://127.0.0.1:5000/api/11_heatmap_skill_location`)).json();
    //         hideLoading(chartId);

    //         // Process the data for visualization
    //         const datasets = [];
    //         const maxValue = Math.max(...data.matrix.flat());

    //         // Create a color scale function - from blue (low) to red (high)
    //         const getColor = (value) => {
    //             // Normalize the value between 0 and 1
    //             const normalized = value / maxValue;
    //             // Generate a color from blue (cold) to red (hot)
    //             return `rgba(${Math.round(normalized * 255)}, ${Math.round((1 - normalized) * 100)}, ${Math.round((1 - normalized) * 255)}, 0.8)`;
    //         };

    //         // Create datasets for heatmap - one dataset per skill
    //         for (let i = 0; i < data.skills.length; i++) {
    //             const pointData = [];

    //             for (let j = 0; j < data.locations.length; j++) {
    //                 // Only include non-zero values to avoid cluttering
    //                 if (data.matrix[i][j] > 0) {
    //                     // Format as Indian rupees (lakhs)
    //                     const formattedCTC = (data.matrix[i][j] / 100000).toFixed(2) + ' Lakhs';

    //                     pointData.push({
    //                         x: j,
    //                         y: i,
    //                         v: data.matrix[i][j], // The actual value
    //                         formatted: formattedCTC // Formatted value for tooltip
    //                     });
    //                 }
    //             }

    //             datasets.push({
    //                 label: data.skills[i],
    //                 data: pointData,
    //                 backgroundColor: pointData.map(p => getColor(p.v)),
    //                 borderColor: 'rgba(0, 0, 0, 0.2)',
    //                 borderWidth: 1,
    //                 pointRadius: 10,
    //                 pointHoverRadius: 12,
    //             });
    //         }

    //         new Chart(document.getElementById(chartId), {
    //             type: 'scatter',
    //             data: {
    //                 datasets: datasets
    //             },
    //             options: {
    //                 responsive: true,
    //                 maintainAspectRatio: false,
    //                 plugins: {
    //                     legend: {
    //                         display: false
    //                     },
    //                     tooltip: {
    //                         callbacks: {
    //                             label: function(context) {
    //                                 const skill = data.skills[context.parsed.y];
    //                                 const location = data.locations[context.parsed.x];
    //                                 const value = context.raw.v;
    //                                 return `${skill} in ${location}: ₹${value.toFixed(2)}`;
    //                             }
    //                         }
    //                     }
    //                 },
    //                 scales: {
    //                     x: {
    //                         type: 'category',
    //                         labels: data.locations,
    //                         title: {
    //                             display: true,
    //                             text: 'Location'
    //                         },
    //                         ticks: {
    //                             maxRotation: 90,
    //                             minRotation: 45
    //                         }
    //                     },
    //                     y: {
    //                         type: 'category',
    //                         labels: data.skills,
    //                         title: {
    //                             display: true,
    //                             text: 'Skill'
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error rendering chart 11:", error);
    //         showError(chartId);
    //     }
    // }


    async function renderChart11() {
        const chartId = 'chart11_heatmap_skill_location';

        // Check if chart element exists before proceeding
        const chartElement = document.getElementById(chartId);
        if (!chartElement) {
            console.warn(`Chart element with ID ${chartId} not found. Skipping rendering.`);
            return;
        }

        showLoading(chartId);

        try {
            let data = await (await fetch(`${BASE_URL}/api/11_heatmap_skill_location`)).json();
            hideLoading(chartId);

            const points = [];
            let maxValue = 0;

            for (let i = 0; i < data.skills.length; i++) {
                for (let j = 0; j < data.locations.length; j++) {
                    const value = data.matrix[i][j];
                    if (value > 0) {
                        maxValue = Math.max(maxValue, value);
                        points.push({
                            x: data.locations[j],
                            y: data.skills[i],
                            v: value,
                            formatted: (value / 100000).toFixed(2) + ' Lakhs'
                        });
                    }
                }
            }

            const getColor = (value) => {
                const normalized = value / maxValue;
                return `rgba(${Math.round(normalized * 255)}, ${Math.round((1 - normalized) * 100)}, ${Math.round((1 - normalized) * 255)}, 0.8)`;
            };

            new Chart(chartElement, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'CTC by Skill and Location',
                        data: points,
                        backgroundColor: points.map(p => getColor(p.v)),
                        borderColor: 'rgba(0, 0, 0, 0.2)',
                        borderWidth: 1,
                        pointRadius: points.map(p => 8 + (p.v / maxValue) * 12), // bubble size
                        pointHoverRadius: 14
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const { x, y, formatted } = context.raw;
                                    return `${y} in ${x}: ₹${formatted}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: 'category',
                            labels: data.locations,
                            title: {
                                display: true,
                                text: 'Location'
                            },
                            ticks: {
                                maxRotation: 90,
                                minRotation: 45
                            }
                        },
                        y: {
                            type: 'category',
                            labels: data.skills,
                            title: {
                                display: true,
                                text: 'Skill'
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Error rendering chart 11:", error);
            showError(chartId);
        }
    }




    async function renderChart12() {
        const chartId = 'chart12_stacked_skills_location';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/12_stacked_skills_location`)).json();
            let bgColors = generateColors(data.skills.length);
            hideLoading(chartId);

            // Prepare datasets for the stacked bar chart
            const datasets = data.skills.map((skill, index) => {
                const skillData = data.locations.map((loc, locIndex) => data.values[locIndex][index]);

                return {
                    label: skill,
                    data: skillData,
                    backgroundColor: bgColors[index],
                    borderColor: getBorderColors([bgColors[index]])[0],
                    borderWidth: 1
                };
            });

            new Chart(document.getElementById(chartId), {
                type: 'bar',
                data: {
                    labels: data.locations,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            display: false // Hide legend as there might be too many skills
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Location'
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Number of Jobs'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 12:", error);
            showError(chartId);
        }
    }

    async function renderChart13() {
        const chartId = 'chart13_bubble_company_ctc';
        showLoading(chartId);
        try {
            let data = await (await fetch(`${BASE_URL}/api/13_bubble_company_ctc`)).json();
            hideLoading(chartId);

            // Group data by skill for better visualization
            const skillGroups = {};
            const skills = [...new Set(data.map(item => item.skill_required))];

            // Create a dataset for each skill
            skills.forEach((skill, index) => {
                const skillData = data.filter(item => item.skill_required === skill);
                skillGroups[skill] = skillData;
            });

            // Create datasets for each skill with a unique color
            const datasets = skills.map((skill, index) => {
                const color = `hsl(${index * (360 / skills.length)}, 70%, 60%)`;
                const items = skillGroups[skill];

                return {
                    label: skill,
                    data: items.map(item => ({
                        x: item.ctc,  // Use CTC as x-axis
                        y: Math.random() * 10,  // Random y position for better spread
                        r: Math.sqrt(item.bubble_size) / 10, // Size scaled for visual appeal
                        skill: item.skill_required,
                        company: item.company_name,
                        ctc: item.ctc
                    })),
                    backgroundColor: color + '80', // Add transparency
                    borderColor: color,
                    borderWidth: 1
                };
            });

            new Chart(document.getElementById(chartId), {
                type: 'bubble',
                data: {
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Top 100 Companies by CTC',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            position: 'top',
                            display: true
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const company = context.raw.company;
                                    const skill = context.raw.skill;
                                    const ctc = context.raw.ctc;

                                    // Format as Indian rupees (lakhs)
                                    const formattedCTC = (ctc / 100000).toFixed(2) + ' Lakhs';

                                    return [
                                        `Company: ${company}`,
                                        `Skill: ${skill}`,
                                        `CTC: ₹${formattedCTC}`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'CTC (₹)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '₹' + (value/100000).toFixed(1) + 'L';
                                }
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                display: false
                            },
                            title: {
                                display: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error rendering chart 13:", error);
            showError(chartId);
        }
    }

    // Handle chart export
    document.querySelectorAll('.export-chart').forEach(button => {
        button.addEventListener('click', function() {
            const chartId = this.getAttribute('data-chart-id');
            const canvas = document.getElementById(chartId);

            // Create download link
            const link = document.createElement('a');
            link.download = `${chartId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    // Fetch data and render charts on page load
    fetchDataAndRenderCharts();
});
