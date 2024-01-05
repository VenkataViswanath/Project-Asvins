import React from 'react';
import "../css/Dashboard.css";
import "../css/Profile.css";
import InsuranceProviderSidebar from './InsuranceProviderSidebar';


const InsuranceProviderPolicies = () => {
    const user = [{
        image: 'http://placekitten.com/g/200/300',
        name: 'Sumanth',
        title: 'Insurance Provider',
    },];

    // Sample data for the table
    const sampleTableData = [
        { planCategory: 'Bronze', insuranceCompanyPays: '60%', youPay: '40%', premium: '$500' },
        { planCategory: 'Silver', insuranceCompanyPays: '70%', youPay: '30%', premium: '$700' },
        { planCategory: 'Gold', insuranceCompanyPays: '80%', youPay: '20%', premium: '$900' },
        { planCategory: 'Platinum', insuranceCompanyPays: '90%', youPay: '10%', premium: '$1200' },
    ];

    return(
        <div className="app">
        <div className="container">
            <InsuranceProviderSidebar user={user} />
            <div className='container'>
            <div className="content">
                <h2>Insurance Packages!</h2>
                <div>
                   {/* Sample table with adjusted size and centered */}
                        <table className="policy-table">
                            <thead>
                                <tr>
                                    <th>Plan Category</th>
                                    <th>Insurance Company Pays</th>
                                    <th>You Pay</th>
                                    <th>Premium</th>
                                 </tr>
                            </thead>
                            <tbody>
                                {sampleTableData.map((plan, index) => (
                                    <tr key={index}>
                                        <td>{plan.planCategory}</td>
                                        <td>{plan.insuranceCompanyPays}</td>
                                        <td>{plan.youPay}</td>
                                        <td>{plan.premium}</td>
                                    </tr>
                                 ))}
                            </tbody>
                        </table>
                </div>
                <div className='block' style={{ marginTop: '20px' }}>
                            <h3>Which health plan category is right for you?</h3>
                            <p>
                                <h4><strong>Bronze</strong></h4>
                                <ul>
                                <li><strong>Lowest</strong> monthly premium. </li>
                                <br />
                                <li><strong>Highest</strong>costs when you need care.</li>
                                <br />
                                <li>Bronze plan deductibles — the amount of medical costs you pay yourself before your insurance plan starts to pay — can be thousands of dollars a year.
                                </li>
                                </ul>
                                <strong>Good choice if:</strong> You want a low-cost way to protect yourself from worst-case medical scenarios.
                                <br /><br />

                                <h4><strong>Silver</strong></h4>
                                <ul>
                                <li><strong>Moderate</strong> monthly premium. </li>
                                <br />
                                <li><strong>Moderate</strong>costs when you need care.</li>
                                <br />
                                <li>Silver deductibles — the costs you pay yourself before your plan pays anything — are usually lower than those of Bronze plans.
                                </li>
                                </ul>
                                <strong>Good choice if:</strong> You qualify for “extra savings” — or, if not, if you are willing to pay a slightly higher monthly premium than Bronze to have more of your routine care covered.
                                <br /><br />


                                <h4><strong>Gold</strong></h4>
                                <ul>
                                <li><strong>High</strong> monthly premium. </li>
                                <br />
                                <li><strong>Low</strong>costs when you need care.</li>
                                <br />
                                <li>Deductibles — the amount of medical costs you pay yourself before your plan pays — are usually low.
                                </li>
                                </ul>
                                <strong>Good choice if:</strong> You are willing to pay more each month to have more costs covered when you get medical treatment. If you use a lot of care, a Gold plan could be a good value.
                                <br /><br />

                                <h4><strong>Platinum</strong></h4>
                                <ul>
                                <li><strong>Highest</strong> monthly premium. </li>
                                <br />
                                <li><strong>Lowest</strong>costs when you need care.</li>
                                <br />
                                <li>Deductibles are very low, meaning your plan starts paying its share earlier than for other categories of plans.
                                </li>
                                </ul>
                                <strong>Good choice if:</strong> You usually use a lot of care and are willing to pay a high monthly premium, knowing nearly all other costs will be covered.
                                <br /><br />
                            </p>
                        </div>

                </div>
                </div>
            </div>
            </div>
    )

    }

export default InsuranceProviderPolicies