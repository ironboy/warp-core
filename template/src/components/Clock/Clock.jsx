<div className="Clock">

  <div className="d-flex mt-5 justify-content-center">
    <Alert color="primary" className="digi-clock light-blue-bg">{this.time}</Alert>
  </div>

  <div className="d-flex mt-2 justify-content-center">
    <AnalogClock value={new Date()} />
  </div>

  <div className="d-flex mt-2 justify-content-center">
    <ExLink href="https://github.com/wojtekmaj/react-clock">
      <small>Analog clock: © Wojciech Maj</small>
    </ExLink>
  </div>

</div>
