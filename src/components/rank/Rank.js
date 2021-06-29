import React from 'react';
const Rank = ( {userName,userEntry}) => {
    return(
        <div>
           <div className='white f3 center'>
            {`${userName}, your current entry count is: `}
           </div>
           <div className='white f1'>
                {`${userEntry}`}
           </div>
        </div>
    );
}

export default Rank;