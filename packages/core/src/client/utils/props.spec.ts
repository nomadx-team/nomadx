/*
    Use cases:

    <my-element /> => false
    <my-element prop={false} /> => false
    <my-element prop="false" /> => false
    
    <my-element prop /> => true, global
    <my-element prop={true} /> => true, global
    <my-element prop="true" /> => true, global
    
    <my-element prop="some value" /> => true, specific
*/

// Describe "Prop is present"
    // should return false if the prop is not present
    // should return true if the prop is set without any value
// Describe "Prop is set directly to a boolean"
    // should return false if the prop value is false
    // should return true if the prop value is true
// Describe "Prop value is a string"
    // should return false if the prop is set to "false"
    // should return true if the prop is set to "true"
    // should return true if the prop is set  string value