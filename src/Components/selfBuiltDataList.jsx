import React from 'react';
import ExpandableProperty from './ExpandableProperty';

const RecursivePropertyContainer = props => {
    return <div className="recursive"></div>
};

export const PropertyName = props => {
    return <span className="recursivename"></span>
}

const RecursiveProperty = props => {
    console.log(props.property)
    return (
        <RecursivePropertyContainer excludeBottomBorder={props.excludeBottomBorder}>
            {props.property ? (
                typeof props.property === "string" ||
                typeof props.property === "number" ||
                typeof props.property === "boolean" ? (
                    <>
                        <PropertyName>{camelCaseToNormal(props.propertyName)}: </PropertyName>
                        {props.property.toString()}
                    </>
                ) : (
                    <ExpandableProperty title={camelCaseToNormal(props.propertyName)} expanded={!!props.rootProperty}>
                        {Object.values(props.property).map((property, index, {length}) => (
                            <RecursiveProperty
                                key={index}
                                property={property}
                                propertyName={Object.getOwnPropertyNames(props.property)[index]}
                                excludeBottomBorder={index === length - 1}
                            />
                        ))}
                    </ExpandableProperty>
                )
            ) : (
                "Property is empty"
            )}
        </RecursivePropertyContainer>
    );
};

const camelCaseToNormal = (str) => str.replace(/([A-Z])/g, ' $1').replace(/^./, str2 => str2.toUpperCase());

export default RecursiveProperty;