import React from 'react';



const SectionInfo = ({ sectionName, sectionTitle, textLeft, textCenter, white }) => {

     // Define a variable to hold class names
     let classNames = 'section-details';

     // Conditionally add class names based on props
     if (textLeft) {
         classNames += ' text-left';
     }
     if (textCenter) {
         classNames += ' text-center';
     }

     // Define a variable to hold class names for the h3 element
    let sectionNameClassNames = 'section-title';

    // Conditionally add the 'white' class name if the 'white' prop is true
    if (white) {
        sectionNameClassNames += ' white';
    }

    return (
        <div className={classNames}>
            <h3 className='section-name'>{sectionName}</h3>
            <h1 className={sectionNameClassNames} dangerouslySetInnerHTML={{ __html: sectionTitle }} />
        </div>
    );
}

export default SectionInfo;
